import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

export const s3 = new AWS.S3();

export const uploadFileToS3 = async (file: File): Promise<string> => {
  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME!,
    Key: `${Date.now()}-${file.name}`,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};