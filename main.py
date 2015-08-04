import json
import webapp2
import time

import model


def AsDict(sample):
  return {'id': sample.key.id(), 'name': sample.name, 'description': sample.description, 'concentration': sample.concentration}


class RestHandler(webapp2.RequestHandler):

  def dispatch(self):
    time.sleep(1)
    super(RestHandler, self).dispatch()


  def SendJson(self, r):
    self.response.headers['content-type'] = 'text/plain'
    self.response.write(json.dumps(r))
    

class QueryHandler(RestHandler):

  def get(self):
    samples = model.AllSamples()
    r = [ AsDict(sample) for sample in samples ]
    self.SendJson(r)


class UpdateHandler(RestHandler):

  def post(self):
    r = json.loads(self.request.body)
    sample = model.UpdateSample(r['id'], r['name'], r['description'], r['concentration'])
    r = AsDict(sample)
    self.SendJson(r)


class InsertHandler(RestHandler):

  def post(self):
    r = json.loads(self.request.body)
    sample = model.InsertSample(r['name'], r['description'], r['concentration'])
    r = AsDict(sample)
    self.SendJson(r)


class DeleteHandler(RestHandler):

  def post(self):
    r = json.loads(self.request.body)
    model.DeleteSample(r['id'])


APP = webapp2.WSGIApplication([
    ('/rest/query', QueryHandler),
    ('/rest/insert', InsertHandler),
    ('/rest/delete', DeleteHandler),
    ('/rest/update', UpdateHandler),
], debug=True)
