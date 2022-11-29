require('dotenv/config');
const aws = require('aws-sdk');
const fs = require('fs');
const spacesEndpoint = new aws.Endpoint(process.env.ENDPOINT);

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

s3.listObjectsV2({
  Bucket: process.env.BUCKET_NAME,
  Delimiter: '/',
  Prefix: process.env.BUCKET_PREFIX
}, (e, data) => {
  if(e) return console.log(e)

  const file = data.Contents  

  file.map(teste => {

    s3.getObject(
      {
        Bucket: process.env.BUCKET_NAME,
        Key:  teste.Key,
      },
      (err, data) => {
        if (err) return console.log(err);

        const filename = teste.Key.split('/')[1]

        fs.writeFile(filename, data.Body, (err, data) => {
          if(err) return
          console.log(data)
        })
  
        console.log(data.Body);
      }
    );
  })
})