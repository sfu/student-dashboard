# Users API

API for accessing information about a user

* [Get a user profile](#get-a-user-profile)
* [Get a user's transit bookmarks](#get-a-users-transit-bookmarks)
* [Add a transit bookmark for a user](#add-a-transit-bookmark-for-a-user)
* [Delete a transit bookmark for a user](#delete-a-transit-bookmark-for-a-user)

**Usage notes:**

The `:username` parameter can either be `self`, or the user's SFU Computing ID (e.g. `kipling`).

## Access and Authentication

### Access

The Users API can be accessed either through the API Gateway via https://api.its.sfu.ca/snap, or directly via https://snap.sfu.ca.

### Authentication

Authentication methods depend on how the API is accessed.

#### Through the API Gateway

Accessing the API through the API Gateway is the preferred method. The following authentiction is required:

* A OAuth access token issued by the API Gateway to an authorized application, sent as a Bearer token in the `Authorization` header. e.g. `Authorization: Bearer xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

#### Directly via https://snap.sfu.ca

If the API is accessed directly via https://snap.sfu.ca, the following authentication is required:

* A valid web session if accessing in the browser; or
* A JWT issued and signed by the API Gateway, sent as a Bearer token in the `Authorization` header. e.g. `Authorization: Bearer ........JWT........`

The JWT's signature will be verified. The JWT must have numeric values encoded as numbers, not strings (e.g. the `exp` and `iat` fields).


## Get a user profile
### `GET /api/v1/users/:username`

Retrieve a user's profile.

Returns a user object.

#### Example Request

```bash
curl https://api.its.sfu.ca/snap/api/v1/users/self \
  -X GET \
  -H 'Authorization: Bearer <...ACCESS_TOKEN...>'
```

#### Example Response
```json
{
  "id": 12345,
  "username": "kipling",
  "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "lastname": "Kipling",
  "firstnames": "Joseph Rudyard",
  "commonname": "Rudy",
  "barcode": "1234567890"
}
```

## Get a user's transit bookmarks
### `GET /api/v1/users/:username/transitBookmarks`

Retrieve the saved transit bookmarks for a user.

Returns an array of transit bookmark objects.

#### Example Request

```bash
curl https://api.its.sfu.ca/snap/api/v1/users/self/transitBookmarks \
  -X GET \
  -H 'Authorization: Bearer <...ACCESS_TOKEN...>'
```

#### Example Response
```json
[
  {
    "stop": "50490",
    "route": "209",
    "destination": "VANCOUVER"
  },
  {
    "stop": "50490",
    "route": "004",
    "destination": "UBC"
  }
]
```

## Add a transit bookmark for a user
### POST /api/v1/users/:username/transitBookmarks

Add a transit bookmark for a user and return the new list of all bookmarks.

#### Usage notes

The new bookmark will be merged with the user's existing bookmarks. The array of bookmarks is unique'd when saving; no duplicate bookmarks will be saved.

The JSON payload must conform to the following schema:

```js
{
  type: 'object',
  properties: {
    stop: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 5
    },
    route: {
      type: 'string',
      required: true
    },
    destination: {
      type: 'string',
      required: true
    }
  }
}
```

No validation of the actual bookmark is performed; it is possible to pass a well-formed, but invalid bookmark. For example, the following is not a real bookmark, but since it passes the schema test it would be saved.

```json
{
  "stop":"12345",
  "route":"666",
  "destination":"Nowhere"
}
```

#### Example Request

```bash
curl https://api.its.sfu.ca/snap/api/v1/users/self/transitBookmarks \
  -X POST \
  -H 'Authorization: Bearer <...ACCESS_TOKEN...>' \
  -d '{"stop":"51861","route":"145","destination":"PRODUCTION STN"}'
```

#### Example Response
```json
[
  {
    "stop": "50490",
    "route": "209",
    "destination": "VANCOUVER"
  },
  {
    "stop": "50490",
    "route": "004",
    "destination": "UBC"
  },
  {
    "stop": "51861",
    "route": "145",
    "destination": "PRODUCTION STN"
  }
]
```

## Delete a transit bookmark for a user
### DELETE /api/v1/users/:username/transitBookmarks

Delete a transit bookmark for a user and return the new list of all bookmarks.

#### Usage notes

Bookmark objects that are not present in the user's bookmarks are ignored; no error is thrown.

The JSON payload must conform to the following schema:

```js
{
  type: 'object',
  properties: {
    stop: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 5
    },
    route: {
      type: 'string',
      required: true
    },
    destination: {
      type: 'string',
      required: true
    }
  }
}
```

This route can also be sent as a `POST` with a `X-HTTP-Method-Override: DELETE` header, for clients that do not support `DELETE` or that do not support sending a body with a `DELETE`.

#### Example Request
```bash
# Using DELETE Method
curl https://api.its.sfu.ca/snap/api/v1/users/self/transitBookmarks \
  -X DELETE \
  -H 'Authorization: Bearer <...ACCESS_TOKEN...>' \
  -d '{"stop":"51861","route":"145","destination":"PRODUCTION STN"}'

# Using POST Method with X-HTTP-Method-Override header
curl https://api.its.sfu.ca/snap/api/v1/users/self/transitBookmarks \
  -X POST
  -H 'X-HTTP-Method-Override: DELETE' \
  -H 'Authorization: Bearer <...ACCESS_TOKEN...>' \
  -d '{"route": "209","stop": "50490","destination": "VANCOUVER"}'
```

#### Example Response
```json
[
  {
    "stop": "50490",
    "route": "209",
    "destination": "VANCOUVER"
  },
  {
    "stop": "50490",
    "route": "004",
    "destination": "UBC"
  }
]
```
