#    Copyright (c) 2016 Intel Corporation.
#    All Rights Reserved.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import logging

from django.utils.translation import ugettext as _
from rest_framework import serializers
from six import add_metaclass

from services.api import storage
from services.api.exceptions import PKUpdateNotPermitted, ResourceNotFound
from services.api.serializers.utils_serializers import check_reference
from services.api.serializers.vpn_choices import RESOURCE_TO_RELATION_MAP

LOG = logging.getLogger(__name__)

# Backend Storage Plugin Instance
CONSUL_CONNECTION = storage.plugin


class ResourceMeta(type):
    def __init__(cls, name, bases, attrs):
        super(ResourceMeta, cls).__init__(name, bases, attrs)

        resource_name = attrs.get('resource_name', None)
        assert resource_name

        primary_key = attrs.get('primary_key', None)
        assert primary_key

        secondary_keys = attrs.get('secondary_keys', [])

        many_to_many_reference = (
            [RESOURCE_TO_RELATION_MAP[resource] for
             resource in attrs.get('many_to_many_reference', [])])

        many_references = (
            [RESOURCE_TO_RELATION_MAP[resource] for
             resource in attrs.get('many_references', [])])

        # Consul Connection object
        cls.conn = CONSUL_CONNECTION

        relation_name = RESOURCE_TO_RELATION_MAP[resource_name]

        if relation_name in cls.conn.relations:
            raise ValueError(
                    _("Relation %s has already been registered" %
                      relation_name))

        cls.conn.relations = {
            relation_name: {
                'primary_key': primary_key,
                'secondary_keys': secondary_keys,
                'many_to_many_reference': many_to_many_reference,
                'many_references': many_references
            }
        }


@add_metaclass(ResourceMeta)
class Resource(object):
    id = None
    resource_name = 'Resource'
    primary_key = 'id'
    secondary_keys = []

    def __init__(self, *initial_data, **kwargs):
        for dictionary in initial_data:
            for key in dictionary:
                setattr(self, key, dictionary[key])
        for key in kwargs:
            setattr(self, key, kwargs[key])

    def _setattrs(self, **kwargs):
        """
        Set each attribute individually
        """
        for k, v in kwargs.iteritems():
            setattr(self, k, v)

    def save(self):
        """Write the record in the storage backend

        Returns:
            self (Resource): Return the object itself

        Raises:
            TypeError: When error storing the project in backend
        """
        try:
            self.conn.put_record(self.get_relation_name(),
                                 self)
            return self
        except (TypeError, RuntimeError):
            LOG.error(_("Error in storing data for %s with id %s" %
                        (self.resource_name, self.id)))
            raise

    def update(self):
        """Write the updated resource to backend"""
        self.save()
        LOG.info(_("%s with id %s updated" % (self.resource_name, self.id)))

    def delete(self):
        """Delete the record from the storage backend

        Raises:
            ResourceNotFound : When no resource exists
        """
        try:
            check_reference(self.resource_name, self.__dict__)
            self.conn.delete_record(self.get_relation_name(), self)
            LOG.info(_("%s with id %s deleted" % (self.resource_name, self.id)))
        except (TypeError, RuntimeError):
            LOG.error(_("Error in deleting data for %s with id %s" %
                        (self.resource_name, self.id)))
            raise

    @classmethod
    def get(cls, **kwargs):
        """Retrieve the record with key(Primary or Secondary) value
        from storage backend

        Args:
            kwargs (dict): Primary Key

        Returns:
            Resource object, list of Resource object or None
        """
        keys = kwargs.keys()
        if len(keys) > 1:
            raise ValueError()
        key = keys[0]

        if key == cls.primary_key:

            record = cls.conn.get_record(cls.get_relation_name(),
                                         kwargs[key])

            if not record:
                LOG.info(
                    _("No %s with id %s" % (cls.resource_name, kwargs[key])))
                # raise ResourceNotFound
                return None

            # Convert the record string to record instance
            return cls(**record)

        elif key in cls.secondary_keys:

            records = cls.conn.get_records_by_secondary_index(
                    cls.get_relation_name(),
                    key,
                    kwargs[key])

            if not records:
                return []

            # Transform the list of record string to list of record instance
            instance_list = [cls(**record) for record in records]

            return instance_list

        else:
            raise ValueError(_("%s is not primary or secondary key of %s" %
                               (key, cls.get_relation_name())))

    @classmethod
    def all(cls, **kwargs):
        """Retrieve all the records from storage backend

        Returns:
            None OR list of project objects
        """
        # Retrieve list of the records in str format
        records = cls.conn.get_records(cls.get_relation_name())

        if not records:
            return []

        # Transform the list of record string to list of record instance
        instance_list = [cls(**record) for record in records]

        return instance_list

    @classmethod
    def get_relation_name(cls):
        return RESOURCE_TO_RELATION_MAP[cls.resource_name]

    @staticmethod
    def resource_validation(resource_name, attrs):
        pass


class ConsulSerializer(serializers.Serializer):
    def create(self, validated_data):
        """Overwrite Serializer .create() method

        Args:
            validated_data (dict) : New Resource object values

        Returns:
            Newly created Resource object
        """
        resource = self.consul_model(**validated_data)

        self.consul_model.resource_validation(self.consul_model.resource_name,
                                              resource.__dict__)

        resource.save()
        return resource

    def update(self, resource, validated_data):
        """Overwrite Serializer .update() method

        Args:
            resource (Resource) : Already existing resource
            validated_data (dict): New Resource object values

        Returns:
            Updated resource object

        Raises:
            IDUpdateNotPermitted: When updating the 'id' of resource
        """
        resource_pk = validated_data.pop(self.consul_model.primary_key,
                                         getattr(resource,
                                                 self.consul_model.primary_key))

        # Primary Key field update should not be permitted
        # Check if existing 'id' value equals 'pk'. If not, 'id' is being
        # updated
        if resource_pk != self.context[self.consul_model.primary_key]:
            LOG.error(_("%s attribute is not permitted to be updated" %
                        resource_pk))
            raise PKUpdateNotPermitted

        for key in validated_data:
            value = validated_data.get(key, getattr(resource, key))
            setattr(resource, key, value)

        self.consul_model.resource_validation(self.consul_model.resource_name,
                                              resource.__dict__)

        resource.update()
        return resource

    def log_invalid(self):
        if self.context.get('pk', None) is None:
            LOG.error(_("Unable to create %s record" %
                        self.context['resource_name']))
        else:
            LOG.error(_("Unable to update %s with id %s" % (
                            self.context['resource_name'],
                            self.context['pk'])))
