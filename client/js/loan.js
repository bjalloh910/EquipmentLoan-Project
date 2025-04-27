document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for delete buttons in the table
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/loans/${loanId}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: 'Loan deleted successfully',
                                confirmButtonColor: '#4a9eff'
                            }).then(() => {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: 'Failed to delete loan',
                                confirmButtonColor: '#4a9eff'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'An error occurred while deleting the loan',
                            confirmButtonColor: '#4a9eff'
                        });
                    });
                }
            });
        });       
    });  

    const modal = document.getElementById('createLoanModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalX');
    const cancelBtn = document.getElementById('cancelBtn');
    const loanForm = document.getElementById('loanForm');

    function closeModal() {
        modal.style.display = 'none';
    }

    function openModal() {
        modal.style.display = 'block';
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Add event listener for form submission
    loanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data and map to the expected field names
        const formData = new FormData(this);
        
        // Format the data properly
        const data = {
            equipmentId: formData.get('equipmentId'),
            userId: formData.get('userId'),
            dateOut: formData.get('dateOut'),
            location: formData.get('location') || null,
            purpose: formData.get('purpose') || 'General Use', // Provide a default value if empty
            units: formData.get('units') ? parseInt(formData.get('units')) : null, // Convert to integer or null
            comments: formData.get('comments') || null
        };
        
        // Validate required fields
        if (!data.equipmentId || !data.userId || !data.dateOut) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Please fill in all required fields: Equipment, User, and Date Out',
                confirmButtonColor: '#4a9eff'
            });
            return;
        }
        

        fetch('/loans/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Loan created successfully',
                    confirmButtonColor: '#4a9eff'
                }).then(() => {
                    closeModal();
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: data.message || 'Failed to create loan',
                    confirmButtonColor: '#4a9eff'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while creating the loan',
                confirmButtonColor: '#4a9eff'
            });
        });
    });

    // Return loan modal
    const returnModal = document.getElementById('returnConfirmationModal');
    const closeReturnModalBtn = document.getElementById('closeReturnModalX');
    const cancelReturnBtn = document.getElementById('cancelReturnBtn');
    const returnForm = document.getElementById('returnForm');


    function closeReturnModal() {
        returnModal.style.display = 'none';
    }

    closeReturnModalBtn.addEventListener('click', closeReturnModal);
    cancelReturnBtn.addEventListener('click', closeReturnModal);

    returnForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const loanId = this.getAttribute('data-loan-id');
        const data = {
            returnDate: formData.get('returnDate')
        };

        fetch(`/loans/${loanId}/return`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Loan returned successfully',
                    confirmButtonColor: '#4a9eff'
                }).then(() => {
                    closeReturnModal();
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: data.message || 'Failed to return loan',
                    confirmButtonColor: '#4a9eff'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while returning the loan',
                confirmButtonColor: '#4a9eff'
            });
        });
    });

    // Add event listener for return button in the table
    document.querySelectorAll('.return-btn').forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            openReturnModal(loanId);
        });
    }); 

    function openReturnModal(loanId) {
        returnModal.style.display = 'block';
        returnForm.setAttribute('data-loan-id', loanId);
        // Set default return date to today
        document.getElementById('returnDate').valueAsDate = new Date();
    }
    
}); 