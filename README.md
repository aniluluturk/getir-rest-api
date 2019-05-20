# Getir REST Api Assignment

This is a sample mongodb data retrieval application written in Nodejs by using Express, Mongoose for development and Mocha, Chai for testing. 

## How to run the app

Installing dependencies

`npm install`

Starting the app

`npm start`


## How to run the integration tests

Running tests with mocha

`npm test`

## API endpoints

#### Root, welcome page

`GET /`

#### Record (fetch by id) endpoint

`GET /records/<record_id>`

Example request

`GET /records/58adc5172a84567a19698e1e`

Example Response

```
{
    "code": 0,
    "msg": "success",
    "record": {
        "counts": [
            0,
            800,
            200
        ],
        "_id": "58adc5172a84567a19698e1e",
        "key": "znFTexLvXKccO5vv",
        "value": "fgzr1Nvxkwp3HIxTryl5o3PbAeruOv0gmbxL08VbO0JPDzii9xGU5k9Wj6ThYKegZbaiEzgbRJYR7B4wOsZKFziBUd8BnHkZZtrCyzOXCOdR5mi1vpRpJDeU2gkehrmIU183ByoH4D07",
        "createdAt": "2016-10-18T00:53:27.182Z"
    }
}
```

#### Records endpoint

Example request

`POST /records`

```
{
    "minCount": 0,
    "maxCount": 1000,
    "startDate": "2016-01-01",
    "endDate": "2018-01-01"
}
```

Example response:

```
{
    "code": 0,
    "msg": "success",
    "records": [
        {
            "_id": "58adc57a1f84e37c19df0cc6",
            "key": "YhwZESHNaSY2gZoi",
            "value": "RvmEC7bQN316vtOHNu6xpOaqO1D1yS746SZu41MrSdepPPRDAW8GnORDqkI2UyObSJcjypiknQHqSYN6u2OgAft1ENp2ABd5FkP5lMvYb4Vmh0ybbHVOIW8tkG0s90vs6QDydVJf45lX",
            "createdAt": "2016-11-18T08:49:23.108Z",
            "counts": [
                600,
                0
            ],
            "totalCount": 600
        }
     ]
}
```
