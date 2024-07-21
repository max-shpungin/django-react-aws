import Form from "../components/Form"

function Login() {
    return <Form route="/api/token/" actionType="login" />
}

export default Login;