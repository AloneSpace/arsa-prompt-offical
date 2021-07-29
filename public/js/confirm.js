$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

$(document).ready(() => {
    $("#confirmBtn").click(() => {
        $.sweetModal.confirm('ยืนยันการสมัครอาสาสมัคร', 'ยืนยันหรือไม่', function () {
            let userId = $.urlParam('id');
            let uri_decoded = JSON.parse(atob(decodeURI(userId)));
            let dataSet = {
                name : $("#name").val(),
                address : $("#address").val(),
                phone : $("#tel").val(),
                otherContact : $("#otherContact").val(),
                province : $("#province").val(),
                ...uri_decoded
            }
            
            console.log(dataSet);

            $.sweetModal('สมัครอาสาสำเร็จ !');

        }, function () {
            // $.sweetModal('You declined. That\'s okay!');
        });
    });
})