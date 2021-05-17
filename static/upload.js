var btn = document.getElementById('btn-upload');
var input = document.getElementById('input-upload');
var uploadArea = document.getElementById('upload-area');
var fileName = document.getElementById('file-name');

btn.addEventListener('click', () => {
  input.click();
});

uploadArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', (event) => {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (event) => {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
  var files = event.dataTransfer.files;
  input.files = files;
  if(files.length > 1) {
    fileName.innerHTML = files.length + "files";
  } else {
    fileName.innerHTML = files[0].name;
  }
});

input.addEventListener('change', (event) => {
  event.preventDefault();
  var files = input.files;
  if(files.length > 1) {
  fileName.innerHTML = files.length + "files";
  } else {
    fileName.innerHTML = files[0].name;
  }
});