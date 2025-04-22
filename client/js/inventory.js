document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all status badges
    const statusBadges = document.querySelectorAll('.status-badge');
    
    statusBadges.forEach(badge => {
        badge.style.cursor = 'pointer'; // Make it look clickable
        badge.addEventListener('click', async function() {
            const row = this.closest('tr');
            const serialCode = row.querySelector('td:nth-child(2)').textContent; // Get serial code from second column
            const currentStatus = this.textContent.trim();
            const newStatus = currentStatus.toLowerCase() === 'available' ? 'in use' : 'Available';
            
            try {
                // Send request to update status
                console.log('Sending request to update status:', { serialCode, newStatus });
                const response = await fetch('/equipment/toggle-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serialCode: serialCode,
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