from google.appengine.ext import ndb

class Sample(ndb.Model):
  name = ndb.StringProperty()
  description = ndb.StringProperty()
  concentration = ndb.StringProperty()


def AllSamples():
  return Sample.query()


def UpdateSample(id, name, description, concentration):
  sample = Sample(id=id, name=name, description=description, concentration=concentration)
  sample.put()
  return sample


def InsertSample(name, description, concentration):
  sample = Sample(name=name, description=description, concentration=concentration)
  sample.put()
  return sample


def DeleteSample(id):
  key = ndb.Key(Sample, id)
  key.delete()
