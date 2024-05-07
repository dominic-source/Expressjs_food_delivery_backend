// check if the file extension for a file upload is allowed
export function allowedExtensions(filename, mimetype) {
    const allowed_extentions = ['png', 'jpg', 'jpeg', 'gif', 'image/png', 'image/jpeg', 'image/gif'];
    const name = filename.split('.');
    if (allowed_extentions.includes(name[name.length-1].toLowerCase()) ||
      allowed_extentions.includes(mimetype.toLowerCase())) {
      return true;
    }
    return false;
  }
