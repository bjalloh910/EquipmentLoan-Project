document.addEventListener('DOMContentLoaded', () => {
    const addModal = document.getElementById('addNewUserModal');
    const addUserForm = document.getElementById('addUserForm');
    const cancelButton = document.getElementById('cancelAddNewUser');
    const cancelX = document.getElementById('cancelX');
    const openModalBtn = document.getElementById('addNewUserBtn');
    const contactTypeSelect = document.getElementById('contact_type');
    const customTypeContainer = document.getElementById('customTypeContainer');
    const customContactTypeInput = document.getElementById('custom_contact_type');
    
    if (contactTypeSelect && customTypeContainer) {
        contactTypeSelect.addEventListener('change', function() {
            if (this.value === 'Other') {
                customTypeContainer.style.display = 'block';
                customContactTypeInput.required = true;
            } else {
                customTypeContainer.style.display = 'none';
                customContactTypeInput.required = false;
            }
        })
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }
    cancelButton.addEventListener('click', () => closeModal(addModal));
    cancelX.addEventListener('click', () => closeModal(addModal));

    window.addEventListener('click', (event) => {
        if (event.target === addModal) {
            closeModal(addModal);
        }
    });

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            addModal.style.display = 'block';
        });
    }

    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(addUserForm);
        const userData = Object.fromEntries(formData);

        fetch('/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal(addModal);
                addUserForm.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User created successfully',
                    confirmButtonColor: '#4a9eff'
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to create user',
                    confirmButtonColor: '#4a9eff'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while creating the user',
                confirmButtonColor: '#4a9eff'
            });
        });
    });


    // Edit User Modal functionality
    const editModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');
    const cancelEditButton = document.getElementById('cancelEditUser');
    const closeXModal = document.getElementById('closeXModal');
    const deleteUserBtn = document.getElementById('deleteUserBtn');

    let currentUserId = null;

    function closeEditModal() {
        editModal.style.display = 'none';
    }

    cancelEditButton.addEventListener('click', () => closeEditModal());
    closeXModal.addEventListener('click', () => closeEditModal());

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    function openEditModal(userId) {
        currentUserId = userId;
        editModal.style.display = 'block';

        // Fetch user data
        fetch(`/users/${userId}`)
            .then(response => response.json())
            .then(data => {
                
                // Populate form fields with user data
                document.getElementById('edit_personnel_name').value = data.personnel_name;
                document.getElementById('edit_contact_type').value = data.contact_type;
                document.getElementById('edit_email').value = data.email;
                document.getElementById('edit_personnel_number').value = data.personnel_number;

                // Handle custom contact type
                if (data.contact_type === 'Other') {
                    document.getElementById('edit_customTypeContainer').style.display = 'block';
                    document.getElementById('edit_custom_contact_type').value = data.custom_contact_type;
                } else {
                    document.getElementById('edit_customTypeContainer').style.display = 'none';
                }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while fetching user data',
                confirmButtonColor: '#4a9eff'
            });
        });
    }

    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            openEditModal(userId);
        });
    });

    // Add event listeners for delete buttons in the table
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
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
                    fetch(`/users/${userId}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: 'User deleted successfully',
                                confirmButtonColor: '#4a9eff'
                            }).then(() => {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: 'Failed to delete user',
                                confirmButtonColor: '#4a9eff'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'An error occurred while deleting the user',
                            confirmButtonColor: '#4a9eff'
                        });
                    });
                }
            });
        });
    });

    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(editUserForm);
        const userData = Object.fromEntries(formData);
        
        fetch(`/users/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeEditModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User updated successfully',
                    confirmButtonColor: '#4a9eff'
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update user',
                    confirmButtonColor: '#4a9eff'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while updating the user',
                confirmButtonColor: '#4a9eff'
            });
        });
    });

    deleteUserBtn.addEventListener('click', () => {
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
                fetch(`/users/${currentUserId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'User deleted successfully',
                            confirmButtonColor: '#4a9eff'
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to delete user',
                            confirmButtonColor: '#4a9eff'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while deleting the user',
                        confirmButtonColor: '#4a9eff'
                    });
                });
            }
        });
    });
})
