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
    $("#deleteAccount").click(async () => {
        let volunteersName = $("#name").val().trim();
        const { value: name } = await Swal.fire({
            title: 'ยืนยันการลบข้อมูลอาสาสมัคร',
            input: 'text',
            inputLabel: 'โปรดกรอกชื่อคุณอีกครั้ง ' + volunteersName,
            inputPlaceholder: 'ใส่ชื่อของคุณ',
            confirmButtonColor: '#dba01f',
            confirmButtonText: 'ยืนยัน',
        })

        if (name == volunteersName.trim()) {
            Swal.fire({
                icon: 'success',
                title: 'ลบสำเร็จ',
                text: 'ลบข้อมูลอาสาสมัครสำเร็จ',
                confirmButtonColor: '#dba01f',
                confirmButtonText: 'ยืนยัน',
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ',
                text: 'ลบไม่สำเร็จ เนื่องจากชื่อไม่ตรงกัน',
                confirmButtonColor: '#dba01f',
                confirmButtonText: 'ยืนยัน',
            })
        }
    })
})