import * as Minio from 'minio'

const runtimeConfig = useRuntimeConfig()

if (!runtimeConfig.BUKET_ENDPOINT) {
    throw new Error('BUKET_ENDPOINT is not set')
}

if (!runtimeConfig.MINIO_USER) {
    throw new Error('MINIO_USER is not set')
}

if (!runtimeConfig.MINIO_PASSWORD) {
    throw new Error('MINIO_PASSWORD is not set')
}



export const uploadFile = async (file: File, bucket: string = 'default', objectName: string) => {
    const minioClient = new Minio.Client({
        endPoint: runtimeConfig.BUKET_ENDPOINT as string,
        port: 9000,
        useSSL: true,
        accessKey: runtimeConfig.MINIO_USER as string,
        secretKey: runtimeConfig.MINIO_PASSWORD as string,
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
    await minioClient.fPutObject(bucket, objectName, file.name)
    console.log('File ' + file.name + ' uploaded as object ' + objectName + ' in bucket ' + bucket)
}