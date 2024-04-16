jQuery(document).ready(function(){
	jQuery('.phone-number-click').click(function() {
		gtag('event', 'Click', {'event_category': 'Phone Number', 'event_label': '', value: 16800, 'send_to': 'UA-149784158-1'});
    	});
	jQuery('.email-address-click').click(function() {
		gtag('event', 'Click', {'event_category': 'Email Link', 'event_label': '', value: 16800, 'send_to': 'UA-149784158-1'});
		});
	});