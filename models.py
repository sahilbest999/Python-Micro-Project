from mongoengine.document import *
from mongoengine.fields import *

class Account(Document):
 username = StringField(required=True)
 password = StringField(required=True)
