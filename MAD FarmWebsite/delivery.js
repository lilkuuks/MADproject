   <script>
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Order tracking page loaded');
            
            document.querySelectorAll('.order-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (!e.target.closest('a, button')) {
                        console.log('Showing order details');
                    }
                });
            });
        });
    </script>