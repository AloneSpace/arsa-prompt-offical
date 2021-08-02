$(document).ready(() => {
    $("#confirmBtn").click(() => {
        Swal.fire({
            title: 'ยืนยันการแก้ไขข้อมูล',
            text: "คุณต้องการยืนยันการแก้ไขหรือไม่",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dba01f',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ปิด'
        }).then((result) => {
            if (result.isConfirmed) {
                let secret = $("#secret").val();
                let dataSet = {
                    name: $("#name").val(),
                    address: $("#address").val(),
                    phone: $("#tel").val(),
                    note: $("#note").val(),
                    province: $("#province").val(),
                }
                axios.post(`/v1/volunteers/update/${secret}`, dataSet)
                    .then(res => {
                        if (res.status == 201) return Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ !',
                            text: 'การแก้ไขข้อมูลสำเร็จ',
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