import unittest

import json
from app.test.base import BaseTestCase


def add_repo(self):
    return self.client.post(
        '/repository/',
        data=json.dumps(dict(
            name='name',
            owner='owner',
            origin='codecov'
        )),
        content_type='application/json'
    )


class TestRepositoryBlueprint(BaseTestCase):
    def test_add_repository(self):
        with self.client:
            response = add_repo(self)
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertEqual(data['message'], 'Successfully created.')
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 201)

    def test_add_repository_exists(self):
        add_repo(self)
        with self.client:
            response = add_repo(self)
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertEqual(
                data['message'], 'Repository already exists.')
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 409)

if __name__ == '__main__':
    unittest.main()
