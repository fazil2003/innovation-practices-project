from etsy2 import *
from etsy2.oauth import EtsyOAuthClient, EtsyOAuthHelper
import urllib.parse as urlparse
from urllib.parse import parse_qs

api_key = 'p8eqqvkph27mp9hrxebyx3re'
shared_secret = 'opmb58lswy'
permission_scopes = ['transactions_r', 'listings_r']

def funcGetVerifier():
    login_url, temp_oauth_token_secret = EtsyOAuthHelper.get_request_url_and_token_secret(api_key, shared_secret, permission_scopes)
    query = urlparse.urlparse(login_url).query
    temp_oauth_token = parse_qs(query)['oauth_token'][0]
    print(temp_oauth_token," - ",temp_oauth_token_secret)
    print("\nLogin URL:\n")
    print(login_url)

def funcGetOAuth(temp_oauth_token, temp_oauth_token_secret, verifier):
    oauth_token, oauth_token_secret = EtsyOAuthHelper.get_oauth_token_via_verifier(api_key, shared_secret, temp_oauth_token, temp_oauth_token_secret, verifier)
    print(oauth_token," - ",oauth_token_secret)

# funcGetVerifier()
funcGetOAuth('21b9585b1444661101fc7d9166b57a', '2965a76782','54e63ee4')