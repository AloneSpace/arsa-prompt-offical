
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) return results[1];
    else return 0;
}

$(document).ready(() => {
    $("#confirmBtn").click(() => {
        Swal.fire({
            title: 'ยืนยันการสมัครอาสา',
            text: "คุณต้องการยืนยันการสมัครอาสาหรือไม่",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dba01f',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ปิด'
        }).then((result) => {
            if (result.isConfirmed) {
                let dataFromLine = $.urlParam('id');
                if (!dataFromLine) return Swal.fire({
                    icon: 'error',
                    title: 'ไม่สำเร็จ',
                    text: 'URL ผิดพลาดโปรดลองอีกครั้ง',
                    footer: '<p>กดปิดเว็บไซต์แล้วกดสมัครอาสาจากในไลน์อีกครั้ง</p>',
                    confirmButtonColor: '#dba01f',
                })
                let uri_decoded = JSON.parse(atob(decodeURI(dataFromLine)));
                let dataSet = {
                    name: $("#name").val(),
                    address: $("#address").val(),
                    phone: $("#tel").val(),
                    otherContact: $("#otherContact").val(),
                    province: $("#province").val(),
                    ...uri_decoded
                }
                console.log(dataSet);
                axios.post('/v1/volunteers/create', dataSet)
                    .then(res => {
                        console.log(res.data);

                        if (res.status == 201) return Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ !',
                            text: 'การสมัครอาสาสำเร็จ',
                            confirmButtonColor: '#dba01f',
                        })
                        return Swal.fire({
                            icon: 'error',
                            title: 'ไม่สำเร็จ',
                            text: res.data.message,
                            confirmButtonColor: '#dba01f',
                        })
                    })
                    .catch(err => {
                        console.log(err.response.data);
                        Swal.fire({
                            icon: 'error',
                            title: 'ไม่สำเร็จ',
                            text: err.response.data.message,
                            confirmButtonColor: '#dba01f',
                        })
                    })
            }
        })
    });
})