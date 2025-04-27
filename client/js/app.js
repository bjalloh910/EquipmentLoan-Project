// client/script.js

// Fetch available equipment
function fetchAvailableEquipment() {
    const loadingElement = document.getElementById('available-items-loading');
    const listElement = document.getElementById('available-items-list');
    
    // Show loading message
    loadingElement.style.display = 'block';
    listElement.innerHTML = '';
    
    fetch('/equipment/available')
        .then(response => response.json())
        .then(data => {
            // Hide loading message
            loadingElement.style.display = 'none';
            
            if (data.equipment && data.equipment.length > 0) {
                // Display each equipment item
                data.equipment.forEach(item => {
                    const equipmentItem = document.createElement('div');
                    equipmentItem.className = 'equipment-item';
                    
                    equipmentItem.innerHTML = `
                        <div class="equipment-info">
                            <div class="equipment-name">${item.model} - ${item.make}</div>
                            <div class="equipment-details">
                                <span><i class="fas fa-barcode"></i> ${item.serial_code}</span>
                                <span><i class="fas fa-tag"></i> ${item.equip_type}</span>
                            </div>
                        </div>
                    `;
                    
                    listElement.appendChild(equipmentItem);
                });
            } else {
                // Display message if no equipment is available
                listElement.innerHTML = '<div class="no-equipment"><i class="fas fa-info-circle"></i> No equipment is currently available.</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching available equipment:', error);
            loadingElement.style.display = 'none';
            listElement.innerHTML = '<div class="no-equipment"><i class="fas fa-exclamation-circle"></i> Error loading available equipment.</div>';
        });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAvailableEquipment);
