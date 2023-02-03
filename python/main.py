from etsy2 import *
from etsy2.oauth import EtsyOAuthClient

etsy_oauth = EtsyOAuthClient(client_key='p8eqqvkph27mp9hrxebyx3re',
                            client_secret='opmb58lswy',
                            resource_owner_key='d075315a9c0dd4b37742837fa0cda4',
                            resource_owner_secret='4a4244641d')
etsy = Etsy(etsy_oauth_client=etsy_oauth)
print(etsy.findAllShopReceipts(shop_id='26785613'))
# print(etsy.findAllShopListingsDraft(shop_id='26785613'))