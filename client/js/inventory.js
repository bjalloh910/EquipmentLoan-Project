document.addEventListener('DOMContentLoaded', () => {
    // Add a helper function to format dates consistently
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Return empty string for invalid dates
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Add click event listeners to all status badges
    const statusBadges = document.querySelectorAll('.status-badge');
    
    statusBadges.forEach(badge => {
        badge.style.cursor = 'pointer'; // Make it look clickable
        badge.addEventListener('click', async function() {
            const row = this.closest('tr');
            const serial_code = row.querySelector('td:nth-child(3)').textContent;
            const currentStatus = this.textContent.trim();
            const newStatus = currentStatus.toLowerCase() === 'available' ? 'in use' : 'Available';
            
            try {
                // Send request to update status
                console.log('Sending request to update status:', { serial_code, newStatus });
                const response = await fetch('/equipment/toggle-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serial_code: serial_code,
                        newStatus: newStatus
                    })
                });

                if (response.ok) {
                    // Update the UI
                    this.textContent = newStatus;
                    this.classList.toggle('status-available');
                    this.classList.toggle('status-checked-out');
                } else {
                    alert('Failed to update status. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the status.');
            }
        });
    });

    // Modal functionality
    const modal = document.getElementById('addEquipmentModal');
    const addBtn = document.getElementById('addEquipmentBtn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelAddEquipment');
    const form = document.getElementById('addEquipmentForm');
    const equipTypeSelect = document.getElementById('equip_type');
    const customTypeContainer = document.getElementById('customTypeContainer');
    const customEquipTypeInput = document.getElementById('custom_equip_type');

    // Show/hide custom equipment type input based on selection
    if (equipTypeSelect && customTypeContainer) {
        equipTypeSelect.addEventListener('change', function() {
            if (this.value === 'Other') {
                customTypeContainer.style.display = 'block';
                customEquipTypeInput.required = true;
            } else {
                customTypeContainer.style.display = 'none';
                customEquipTypeInput.required = false;
            }
        });
    }

    // Open modal
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }

    // Close modal functions
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const formData = new FormData(form); // form data function will collect all the data from the form
            
            const equipmentData = {
                serial_code: formData.get('serial_code'),
                model: formData.get('model'),
                make: formData.get('make'),
                purchase_date: formData.get('purchase_date') || null,
                checkout_status: formData.get('checkout_status'),
                health: formData.get('health'),
                firmware_update: formData.get('firmware_update') || null,
                total_days_inuse: formData.get('total_days_inuse') ? parseInt(formData.get('total_days_inuse')) : null,
                notes: formData.get('notes'),
            };


            // Handle custom equipment type
            if (formData.get('equip_type') === 'Other' && formData.get('custom_equip_type')) {
                equipmentData['equip_type'] = formData.get('custom_equip_type');
            } else {
                equipmentData['equip_type'] = formData.get('equip_type');
            }
            
            console.log('Equipment data to be submitted:', equipmentData);

            try {
                const response = await fetch ('/equipment/add', {
                    method: 'POST',
                    headers : { 'Content-Type': 'application/json'},
                    body: JSON.stringify(equipmentData),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Equipment added successfully!');
                    form.reset();
                    customTypeContainer.style.display = 'none';
                    closeModal();

                    const newEquip = data.equipment;
                    const tableBody = document.getElementById('equipmentTableBody');

                    const newRow = document.createElement('tr');
                    
                    newRow.innerHTML = `
                        <td><strong>${newEquip.model}</strong></td>
                        <td>${newEquip.make}</td>
                        <td>${newEquip.serial_code}</td>
                        <td>${newEquip.equip_type}</td>
                        <td>${formatDate(newEquip.purchase_date)}</td>
                        <td>
                            <span class="health-indicator health-critical">
                                ${newEquip.health}
                            </span>
                        </td>
                        <td>${newEquip.total_days_inuse !== null && newEquip.total_days_inuse !== undefined ? newEquip.total_days_inuse : ''}</td>
                        <td>${formatDate(newEquip.firmware_update)}</td>
                        <td>
                            <span class="status-badge ${newEquip.checkout_status.toLowerCase() === 'available' ? 'status-available' : 'status-checked-out'}" data-serial="${newEquip.serial_code}">
                                ${newEquip.checkout_status}
                            </span>
                        </td>
                        <td>${newEquip.notes || ''}</td>
                        <td>
                            <button class="edit-btn" data-serial="${newEquip.serial_code}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(newRow);
                    
                    // Add click event listener to the new status badge
                    const newStatusBadge = newRow.querySelector('.status-badge');
                    newStatusBadge.style.cursor = 'pointer';
                    newStatusBadge.addEventListener('click', async function() {
                        const row = this.closest('tr');
                        const serial_code = row.querySelector('td:nth-child(3)').textContent;
                        const currentStatus = this.textContent.trim();
                        const newStatus = currentStatus.toLowerCase() === 'available' ? 'in use' : 'Available';
                        
                        try {
                            // Send request to update status
                            console.log('Sending request to update status:', { serial_code, newStatus });
                            const response = await fetch('/equipment/toggle-status', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    serial_code: serial_code,
                                    newStatus: newStatus
                                })
                            });

                            if (response.ok) {
                                // Update the UI
                                this.textContent = newStatus;
                                this.classList.toggle('status-available');
                                this.classList.toggle('status-checked-out');
                            } else {
                                alert('Failed to update status. Please try again.');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            alert('An error occurred while updating the status.');
                        }
                    });
                } else {
                    alert('Failed to add equipment. Please try again.');
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while adding the equipment.');
            }
        });
    }

    // Edit Equipment Modal
    const editBtn = document.querySelectorAll('.edit-btn');
    const editModal = document.getElementById('editEquipmentModal');
    const editForm = document.getElementById('editEquipmentForm');
    const editCancelBtn = document.getElementById('cancelEditEquipment');
    const closetopX = document.getElementById('closeEditModal');
    
    // Handle equipment type selection in edit form
    const editEquipTypeSelect = document.getElementById('edit_equip_type');
    const editCustomTypeContainer = document.getElementById('edit_customTypeContainer');
    const editCustomEquipTypeInput = document.getElementById('edit_custom_equip_type');
    
    if (editEquipTypeSelect && editCustomTypeContainer) {
        editEquipTypeSelect.addEventListener('change', function() {
            if (this.value === 'Other') {
                editCustomTypeContainer.style.display = 'block';
                editCustomEquipTypeInput.required = true;
            } else {
                editCustomTypeContainer.style.display = 'none';
                editCustomEquipTypeInput.required = false;
            }
        });
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    //close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    editCancelBtn.addEventListener('click', closeEditModal);

    closetopX.addEventListener('click', closeEditModal);
    
    editBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.cells;
            const equipmentId = row.dataset.id;
           
            
            // Get values from table cells (using index since we know the order)
            document.getElementById('edit_model').value = cells[0].textContent.trim();
            document.getElementById('edit_make').value = cells[1].textContent.trim();
            document.getElementById('edit_serial_code').value = cells[2].textContent.trim();
            
            // Handle equipment type
            const equipType = cells[3].textContent.trim();
            console.log("Equipment type from table:", equipType);
            
            const equipTypeSelect = document.getElementById('edit_equip_type');
            const customTypeContainer = document.getElementById('edit_customTypeContainer');
            const customEquipTypeInput = document.getElementById('edit_custom_equip_type');
            
            console.log("Equipment type select element:", equipTypeSelect);
            console.log("Custom type container:", customTypeContainer);
            console.log("Custom equip type input:", customEquipTypeInput);
            
            // Check if the equipment type is in our predefined list
            const predefinedTypes = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Projector'];
            console.log("Is predefined type:", predefinedTypes.includes(equipType));
            
            if (predefinedTypes.includes(equipType)) {
                console.log("Setting to predefined type:", equipType);
                equipTypeSelect.value = equipType;
                if (customTypeContainer) customTypeContainer.style.display = 'none';
                if (customEquipTypeInput) customEquipTypeInput.required = false;
            } else {
                console.log("Setting to custom type:", equipType);
                equipTypeSelect.value = 'Other';
                if (customTypeContainer) customTypeContainer.style.display = 'block';
                if (customEquipTypeInput) {
                    customEquipTypeInput.value = equipType;
                    customEquipTypeInput.required = true;
                }
            }
            
            const purchaseDate = cells[4].textContent.trim();
            document.getElementById('edit_purchase_date').value = purchaseDate ? new Date(purchaseDate).toISOString().split('T')[0] : '';
            
            
            const healthCell = cells[5].querySelector('.health-indicator');
            document.getElementById('edit_health').value = healthCell ? healthCell.textContent.trim() : cells[5].textContent.trim();
            console.log("health cell ", healthCell);
            
            document.getElementById('edit_total_days_inuse').value = cells[6].textContent.trim();
            
            
            const firmwareDate = cells[7].textContent.trim();
            document.getElementById('edit_firmware_update').value = firmwareDate ? new Date(firmwareDate).toISOString().split('T')[0] : '';
            
            
            const statusCell = cells[8].querySelector('.status-badge');
            document.getElementById('edit_checkout_status').value = statusCell ? statusCell.textContent.trim() : cells[8].textContent.trim();
            
            document.getElementById('edit_notes').value = cells[9].textContent.trim();
            
            editForm.dataset.id = equipmentId;
            editModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Add event listener for edit form submission
    editForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const formData = new FormData(editForm);
        
        const equipmentData = {
            serial_code: formData.get('edit_serial_code'),
            model: formData.get('edit_model'),
            make: formData.get('edit_make'),
            purchase_date: formData.get('edit_purchase_date'),
            checkout_status: formData.get('edit_checkout_status'),
            health: formData.get('edit_health'),
            firmware_update: formData.get('edit_firmware_update'),
            total_days_inuse: formData.get('edit_total_days_inuse') ? parseInt(formData.get('edit_total_days_inuse')) : null,
            notes: formData.get('edit_notes'),
        };

        // Handle custom equipment type
        if (formData.get('edit_equip_type') === 'Other' && formData.get('edit_custom_equip_type')) {
            equipmentData['equip_type'] = formData.get('edit_custom_equip_type');
        } else {
            equipmentData['equip_type'] = formData.get('edit_equip_type');
        }
        
        console.log('Equipment data to be updated:', equipmentData);
        console.log('Sending request to:', `/equipment/update/${equipmentData.serial_code}`);

        try {
            const response = await fetch(`/equipment/update/${equipmentData.serial_code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(equipmentData)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Server response:', response.status, data);

            if (response.ok) {
                alert('Equipment updated successfully!');
                // Update the row in the table
                const row = document.querySelector(`button[data-serial="${equipmentData.serial_code}"]`).closest('tr');
                const cells = row.cells;
                
                cells[0].innerHTML = `<strong>${equipmentData.model}</strong>`;
                cells[1].textContent = equipmentData.make;
                cells[2].textContent = equipmentData.serial_code;
                cells[3].textContent = equipmentData.equip_type;
                cells[4].textContent = formatDate(equipmentData.purchase_date);
                cells[5].innerHTML = equipmentData.health ? 
                    `<span class="health-indicator health-critical">${equipmentData.health}</span>` : '';
                cells[6].textContent = equipmentData.total_days_inuse || '';
                cells[7].textContent = formatDate(equipmentData.firmware_update);
                cells[8].innerHTML = `
                    <span class="status-badge ${String(equipmentData.checkout_status).toLowerCase() === 'available' ? 'status-available' : 'status-checked-out'}" 
                          data-serial="${equipmentData.serial_code}">
                        ${String(equipmentData.checkout_status)}
                    </span>`;
                cells[9].textContent = equipmentData.notes || '';
                
                // Close the modal
                closeEditModal();
            } else {
                alert('Failed to update equipment. Please try again.');
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the equipment.');
        }
    });

    // Delete Equipment
    const deleteBtn = document.getElementById('delete_equipment');

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async function() {
            const equipmentId = editForm.dataset.id;
            const row = document.querySelector(`tr[data-id="${equipmentId}"]`);
            
            if (!row) {
                console.error('Could not find row element');
                return;
            }

            if (confirm("Are you sure you want to delete this equipment?")) {
                try {
                    const response = await fetch(`/equipment/delete/${equipmentId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        row.remove();
                        closeEditModal();
                        alert('Equipment deleted successfully!');
                    } else {
                        const data = await response.json();
                        alert('Failed to delete equipment: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the equipment.');
                }
            }
        });
    }
});