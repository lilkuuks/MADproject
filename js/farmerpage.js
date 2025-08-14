<script>
        let crops = JSON.parse(localStorage.getItem('farmerCrops')) || [];
        
        document.getElementById('cropForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const crop = {
                id: Date.now(),
                name: document.getElementById('cropName').value.trim(),
                type: document.getElementById('cropType').value,
                quantity: parseFloat(document.getElementById('quantity').value),
                unit: document.getElementById('unit').value,
                price: parseFloat(document.getElementById('price').value),
                quality: document.getElementById('quality').value,
                harvestDate: document.getElementById('harvestDate').value,
                description: document.getElementById('description').value.trim(),
                dateAdded: new Date().toLocaleDateString(),
                dateAddedISO: new Date().toISOString(),
                sold: false,
                revenue: 0,
                soldDate: null
            };
            
            if (crop.quantity <= 0 || crop.price <= 0) {
                showAlert('Please enter valid quantity and price values.', 'error');
                return;
            }
            
            crops.push(crop);
            saveCrops();
            displayCrops();
            updateStats();
            updateAnalytics();
            this.reset();
            
            showAlert('Crop uploaded successfully!', 'success');
        });

        function saveCrops() {
            localStorage.setItem('farmerCrops', JSON.stringify(crops));
        }

        function showAlert(message, type) {
            const alertContainer = document.getElementById('alertContainer');
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.textContent = message;
            alertContainer.appendChild(alertDiv);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }

        function displayCrops() {
            const cropList = document.getElementById('cropList');
            
            if (crops.length === 0) {
                cropList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-seedling"></i>
                        <h3>No crops uploaded yet</h3>
                        <p>Start by adding your first crop using the form on the left!</p>
                    </div>
                `;
                return;
            }
            
            cropList.innerHTML = crops.map(crop => `
                <div class="crop-item">
                    <h3>${crop.name} <span style="color: #7f8c8d; font-size: 14px;">(${crop.type})</span></h3>
                    <div class="crop-details">
                        <div class="crop-detail"><strong>Quantity:</strong> ${crop.quantity} ${crop.unit}</div>
                        <div class="crop-detail"><strong>Price:</strong> $${crop.price.toFixed(2)}/${crop.unit}</div>
                        <div class="crop-detail"><strong>Quality:</strong> ${crop.quality}</div>
                        <div class="crop-detail"><strong>Added:</strong> ${crop.dateAdded}</div>
                        <div class="crop-detail"><strong>Harvest:</strong> ${crop.harvestDate || 'N/A'}</div>
                        <div class="crop-detail"><strong>Status:</strong> ${crop.sold ? 'Sold' : 'Available'}</div>
                    </div>
                    ${crop.sold ? `<div class="crop-detail"><strong>Sold for:</strong> $${crop.revenue.toFixed(2)} on ${crop.soldDate}</div>` : ''}
                    <p style="margin-top: 10px; color: #555;">${crop.description || 'No description provided.'}</p>
                    <div class="crop-actions">
                        ${!crop.sold ? `
                            <button class="btn btn-small btn-success" onclick="markAsSold(${crop.id})">
                                <i class="fas fa-check"></i> Mark as Sold
                            </button>
                        ` : ''}
                        <button class="btn btn-small" style="background: #f39c12;" onclick="editCrop(${crop.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="deleteCrop(${crop.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function markAsSold(id) {
            const crop = crops.find(c => c.id === id);
            if (crop) {
                const revenue = crop.quantity * crop.price;
                crop.sold = true;
                crop.revenue = revenue;
                crop.soldDate = new Date().toLocaleDateString();
                saveCrops();
                displayCrops();
                updateStats();
                updateAnalytics();
                showAlert(`Crop sold for $${revenue.toFixed(2)}!`, 'success');
            }
        }

        function editCrop(id) {
            const crop = crops.find(c => c.id === id);
            if (crop) {
                document.getElementById('cropName').value = crop.name;
                document.getElementById('cropType').value = crop.type;
                document.getElementById('quantity').value = crop.quantity;
                document.getElementById('unit').value = crop.unit;
                document.getElementById('price').value = crop.price;
                document.getElementById('quality').value = crop.quality;
                document.getElementById('harvestDate').value = crop.harvestDate || '';
                document.getElementById('description').value = crop.description;
                
                deleteCrop(id);
                document.getElementById('cropName').focus();
                showAlert('Crop loaded for editing. Make your changes and submit.', 'success');
            }
        }

        function deleteCrop(id) {
            if (confirm('Are you sure you want to delete this crop? This action cannot be undone.')) {
                crops = crops.filter(c => c.id !== id);
                saveCrops();
                displayCrops();
                updateStats();
                updateAnalytics();
                showAlert('Crop deleted successfully.', 'success');
            }
        }

        function updateStats() {
            const totalCrops = crops.length;
            const soldCrops = crops.filter(c => c.sold).length;
            const totalRevenue = crops.reduce((sum, crop) => sum + (crop.revenue || 0), 0);
            const availableCrops = totalCrops - soldCrops;
            
            document.getElementById('totalCrops').textContent = totalCrops;
            document.getElementById('soldCrops').textContent = soldCrops;
            document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
            document.getElementById('availableCrops').textContent = availableCrops;
        }

        function updateAnalytics() {
            const analyticsDiv = document.getElementById('analytics');
            
            if (crops.length === 0) {
                analyticsDiv.innerHTML = '<p>No data available yet. Add some crops to see analytics.</p>';
                return;
            }
            
            const totalRevenue = crops.reduce((sum, crop) => sum + (crop.revenue || 0), 0);
            const totalValue = crops.reduce((sum, crop) => sum + (crop.quantity * crop.price), 0);
            const soldCrops = crops.filter(c => c.sold);
            const availableCrops = crops.filter(c => !c.sold);
            
            const cropTypes = {};
            crops.forEach(crop => {
                cropTypes[crop.type] = (cropTypes[crop.type] || 0) + 1;
            });
            
            const topCropType = Object.entries(cropTypes).sort((a, b) => b[1] - a[1])[0];
            
            analyticsDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div>
                        <h4>Total Portfolio Value</h4>
                        <p style="font-size: 1.5em; color: #3498db;">$${totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                        <h4>Revenue Generated</h4>
                        <p style="font-size: 1.5em; color: #27ae60;">$${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                        <h4>Sales Rate</h4>
                        <p style="font-size: 1.5em; color: #f39c12;">${crops.length > 0 ? ((soldCrops.length / crops.length) * 100).toFixed(1) : 0}%</p>
                    </div>
                    <div>
                        <h4>Most Popular Type</h4>
                        <p style="font-size: 1.5em; color: #e74c3c;">${topCropType ? topCropType[0] : 'N/A'}</p>
                    </div>
                </div>
            `;
        }

        function exportData() {
            const dataStr = JSON.stringify(crops, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'farmer-crops-data.json';
            link.click();
            URL.revokeObjectURL(url);
        }

        function importData(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedCrops = JSON.parse(e.target.result);
                        if (Array.isArray(importedCrops)) {
                            crops = [...crops, ...importedCrops];
                            saveCrops();
                            displayCrops();
                            updateStats();
                            updateAnalytics();
                            showAlert('Data imported successfully!', 'success');
                        }
                    } catch (error) {
                        showAlert('Error importing data. Please check the file format.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        }

        displayCrops();
        updateStats();
        updateAnalytics();

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                document.getElementById('cropName').focus();
            }
        });
    </script>