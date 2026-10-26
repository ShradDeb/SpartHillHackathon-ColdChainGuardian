import unittest
from unittest.mock import Mock
from nearby import lookup, rank_pharmacies

class NearbyTests(unittest.TestCase):
    def test_ranking_uses_coordinates_not_provider_order(self):
        items=[{'PlaceId':'far','Title':'Far','Position':[-122,37.1]}, {'PlaceId':'near','Title':'Near','Position':[-122,37.001]}]
        rows=rank_pharmacies(items+[items[0]],37,-122)
        self.assertEqual([x['name'] for x in rows],['Near','Far'])
        self.assertIn('origin=37%2C-122',rows[0]['maps_url'])
    def test_rejects_invalid_location_before_aws(self):
        runtime=Mock()
        for value in (True, float('nan'), 91, '37'):
            with self.assertRaises(ValueError):lookup({'latitude':value,'longitude':0},runtime)
        runtime.assert_not_called()
    def test_bedrock_receives_venue_only(self):
        places=Mock(); bedrock=Mock(); session=Mock()
        session.client.side_effect=lambda name,**kw: places if name=='geo-places' else bedrock
        places.search_nearby.return_value={'ResultItems':[{'Title':'Public Pharmacy','Address':{'Label':'1 Example Street'},'Position':[-122.001,37.001]}],'ResponseMetadata':{'RequestId':'location-test'}}
        bedrock.converse.return_value={'output':{'message':{'content':[{'text':'Confirm power and storage acceptance with this pharmacy.'}]}},'ResponseMetadata':{'RequestId':'bedrock-test'}}
        result=lookup({'latitude':37.012345,'longitude':-122.012345},lambda:(session,'us-east-1','model',True))
        self.assertTrue(result['bedrock'])
        args=bedrock.converse.call_args.kwargs
        self.assertNotIn('37.012345',str(args))
        self.assertNotIn('-122.012345',str(args))
        self.assertEqual(places.search_nearby.call_args.kwargs['QueryPosition'],[-122.012345,37.012345])
    def test_denied_lookup_does_not_invent_result(self):
        from botocore.exceptions import ClientError
        session=Mock();session.client.return_value.search_nearby.side_effect=ClientError({'Error':{'Code':'AccessDeniedException','Message':'private diagnostic'}},'SearchNearby')
        with self.assertRaisesRegex(ValueError,'administrator'):
            lookup({'latitude':37,'longitude':-122},lambda:(session,'us-east-1','model',True))

if __name__=='__main__':unittest.main()
