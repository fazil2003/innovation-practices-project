// const obj = JSON.parse(
//     '{"access_token": "417870418.reUQdxjx45od4VbRVBmz-d0iPIU4YIJzQKO1fE8ygsmwj7ltTUAwtTyk0NEG8bcfBvrQGKbSuhuc-yHVw5nU2wXVJt","token_type": "Bearer","expires_in": 3600,"refresh_token": "417870418.IU7uwYdejhlrGL2lnAjKkG7TPVZEmUnr-hM4fl8jOhsUkTAn_Fu8fW5c1qOLauJXs8lX2SJZ77dvi5MLwh4QcRKhmS"}'
// );

// console.log(obj['access_token']);
// console.log(obj['refresh_token']);

const obj = JSON.parse(
    '{"count": 1,"results": [{"shop_id": 26785613,"shop_name": "HappyByVimalYet","user_id": 417870418}]}'
)

console.log(obj['results'][0]['shop_id']);