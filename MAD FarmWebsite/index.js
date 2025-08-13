<script>
        document.addEventListener('DOMContentLoaded', function() {
            const uploadModal = document.getElementById('upload-modal');
            const openModalButtons = document.querySelectorAll('.upload-btn');
            const closeModal = document.getElementById('close-modal');
            const cancelUpload = document.getElementById('cancel-upload');
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const previewContainer = document.getElementById('preview-container');
            
            openModalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    uploadModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                });
            });
            
            closeModal.addEventListener('click', function() {
                uploadModal.classList.add('hidden');
                document.body.style.overflow = '';
            });
            
            cancelUpload.addEventListener('click', function() {
                uploadModal.classList.add('hidden');
                document.body.style.overflow = '';
            });
            
            uploadModal.addEventListener('click', function(e) {
                if (e.target === uploadModal) {
                    uploadModal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight(e) {
                dropZone.classList.add('border-green-500', 'bg-green-50');
                dropZone.classList.remove('border-gray-300');
            }
            
            function unhighlight(e) {
                dropZone.classList.remove('border-green-500', 'bg-green-50');
                dropZone.classList.add('border-gray-300');
            }
            
            dropZone.addEventListener('drop', handleDrop, false);
            fileInput.addEventListener('change', handleFiles, false);
            dropZone.addEventListener('click', function() {
                fileInput.click();
            });
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles({target: {files: files}});
            }
            
            function handleFiles(e) {
                const files = e.target.files;
                previewContainer.innerHTML = '';
                
                if (files.length > 5) {
                    alert('Maximum 5 images allowed');
                    return;
                }
                
                Array.from(files).forEach(file => {
                    if (!file.type.match('image.*')) return;
                    
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const previewDiv = document.createElement('div');
                        previewDiv.className = 'relative w-24 h-24';
                        
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'w-full h-full object-cover rounded';
                        
                        const removeBtn = document.createElement('button');
                        removeBtn.className = 'absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700';
                        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                        removeBtn.onclick = function() {
                            previewDiv.remove();
                        };
                        
                        previewDiv.appendChild(img);
                        previewDiv.appendChild(removeBtn);
                        previewContainer.appendChild(previewDiv);
                    };
                    
                    reader.readAsDataURL(file);
                });
            }
            
            const uploadForm = document.getElementById('upload-form');
            uploadForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Your crop listing has been submitted successfully!');
                uploadModal.classList.add('hidden');
                document.body.style.overflow = '';
                uploadForm.reset();
                previewContainer.innerHTML = '';
            });
        });
</script>