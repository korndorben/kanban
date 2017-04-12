$(function (win) {
    $(document).keydown(function (event) {
        // console.log(event);
        switch (event.key) {
            case 'e':
                console.log(location.pathname.replace('task','edit'));
                location.href = location.pathname.replace('doc','edit');
                break;
            case 'Escape':
                history.back();
                break;
            default:
                return;

        }
    })
})
