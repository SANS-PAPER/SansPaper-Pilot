import AWS from 'aws-sdk';

// Configure the AWS SDK with your DigitalOcean credentials
//const spacesEndpoint = new AWS.Endpoint(process.env.DIGITAL_OCEAN_ENDPOINT!);

// Configure the AWS SDK with your DigitalOcean Space credentials
const s3 = new AWS.S3({
  endpoint: 'https://syd1.digitaloceanspaces.com', // Change to your region endpoint
  accessKeyId: 'DO00GW2DRTFHUDZTJVXZ', // Set your access key
  secretAccessKey: 'QfbgNaq3jjmW96i4NWpMXa0HvyLVLQku+XBFYdxdAEE', // Set your secret key
});


console.log('DigitalOcean S3 client initialized', s3);

// Function to list all files in the given bucket/path
export const listFilesInSpace = async () => {
  try {
    const params = {
      Bucket: 'spf-assets-aus', // Replace with your bucket name
      Prefix: '',               // Leave empty to fetch all files
    };

    const data = await s3.listObjectsV2(params).promise();
    return data.Contents?.map((item) => item.Key); // Returns an array of file keys (file paths)
  } catch (err) {
    console.error('Error fetching files from DigitalOcean:', err);
    return [];
  }
};
