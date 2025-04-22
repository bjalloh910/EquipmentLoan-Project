document.addEventListener('DOMContentLoaded', () => {
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
});