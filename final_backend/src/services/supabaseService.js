const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Cloud storage will not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file to Supabase Storage
 * @param {Object} file - Multer file object
 * @param {string} bucket - Supabase bucket name
 * @param {string} folder - Folder within bucket
 * @returns {string} - Public URL of the uploaded file
 */
const uploadFile = async (file, bucket = 'academa-files', folder = 'general') => {
  try {
    const fileName = `${folder}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Supabase Upload Error:', error.message);
    throw new Error('Failed to upload file to cloud storage');
  }
};

/**
 * Deletes a file from Supabase Storage
 */
const deleteFile = async (fileUrl, bucket = 'academa-files') => {
  try {
    const fileName = fileUrl.split(`${bucket}/`)[1];
    if (!fileName) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error('Supabase Delete Error:', error.message);
  }
};

module.exports = {
  supabase,
  uploadFile,
  deleteFile
};
