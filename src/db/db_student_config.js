/*
 * @LastEditors: gcz
*https://github.com/verybigorange/idb-js
 */
export default {
    dbName: "nav",
    version: 1,
    tables: [
      {
        tableName: "link",
        option: { keyPath: "_id" },
        indexs: [
          {
            key: "_id",
            option:{
              unique: true
            }
          },
          {
            key: "title"
          },
          {
            key: "desc",
          },
          {
            key: "url"
          },
          {
            key: "type"
          },
          {
            key: "icon"
          },
          {
            key: "clicks"
          },
          {
            key: "code"
          },
        ]
      },
      {
        tableName: "type",
        option: { keyPath: "_id" },
        indexs: [
          {
            key: "_id",
            option:{
              unique: true
            }
          },
          {
            key: "type"
          },
          {
            key: "code"
          }
        ]
      }
    ]
  };