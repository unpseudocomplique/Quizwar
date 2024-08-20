import * as Minio from 'minio'

const runtimeConfig = useRuntimeConfig()
if (!runtimeConfig.bucketEndpoint) {
    throw new Error('bucketEndpoint is not set')
}

if (!runtimeConfig.minioUser) {
    throw new Error('minioUser is not set')
}

if (!runtimeConfig.minioPassword) {
    throw new Error('minioPassword is not set')
}


function blobToStream(blob: Blob) {
    const stream = require('stream');
    const readable = new stream.PassThrough();
    readable.end(blob);
    return readable;
}


export const uploadFile = async (file: Buffer, bucket: string = 'default', objectName: string) => {
    const minioClient = new Minio.Client({
        endPoint: runtimeConfig.bucketEndpoint as string,
        port: 443,
        useSSL: true,
        accessKey: runtimeConfig.minioUser as string,
        secretKey: runtimeConfig.minioPassword as string,
    })

    // Check if the bucket exists
    // If it doesn't, create it
    const exists = await minioClient.bucketExists(bucket)
    if (exists) {
        console.log('Bucket ' + bucket + ' exists.')
    } else {
        const region = 'DE'
        await minioClient.makeBucket(bucket, region)
        console.log(`Bucket  ${bucket} created in ${region}.`)
    }

    // Set the object metadata
    // var metaData = {
    //     'Content-Type': 'text/plain',
    //     'X-Amz-Meta-Testing': 1234,
    //     example: 5678,
    // }

    // Upload the file with fPutObject
    // If an object with the same name exists,
    // it is updated with new data
    // await minioClient.fPutObject(bucket, objectName, file.name)
    await minioClient.putObject(bucket, objectName, file)
    const imageLink = await minioClient.getObject(bucket, objectName)
    console.log('File ' + ' uploaded as object ' + objectName + ' in bucket ' + bucket)
}