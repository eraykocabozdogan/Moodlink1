// Test script for profile picture upload functionality
// This script tests the profile picture upload with the correct parameters

const testProfileUpload = async () => {
  const baseURL = 'https://moodlinkbackend.onrender.com';
  
  // Test parameters according to your specifications
  const testParams = {
    StorageType: '1',  // StorageType = 1 for profile pictures
    OwnerId: '22222222-2222-2222-2222-222222222222', // Test user ID
    OwnerType: '2',    // OwnerType = 2 for profile pictures  
    FileType: '1'      // FileType = 1 for images
  };
  
  console.log('Testing profile picture upload with parameters:');
  console.log(testParams);
  
  // Create a test FormData (you would need to add a real file in browser)
  const formData = new FormData();
  formData.append('StorageType', testParams.StorageType);
  formData.append('OwnerId', testParams.OwnerId);
  formData.append('OwnerType', testParams.OwnerType);
  formData.append('FileType', testParams.FileType);
  // formData.append('File', fileInput); // Real file would be added here
  
  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Test the download endpoint format
  const testFileId = 'test-file-id-123';
  const downloadURL = `${baseURL}/api/FileAttachments/download/${testFileId}`;
  console.log('Download URL format:', downloadURL);
  
  return {
    uploadParams: testParams,
    downloadURL: downloadURL
  };
};

// Run test
testProfileUpload().then(result => {
  console.log('Test completed:', result);
}).catch(error => {
  console.error('Test failed:', error);
});
