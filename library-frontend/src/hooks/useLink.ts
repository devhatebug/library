import {useNavigate} from "@tanstack/react-router";

const useLink = () => {
    const navigate = useNavigate();
    return {navigate}
}

export default useLink;