import PageNotFound from '../asserts/404.jpg'

function NotFound() {
    return <div>
        <img src={PageNotFound} alt="404" style={{width: '100%', height: '100%'}}/>
    </div>
}

export default NotFound