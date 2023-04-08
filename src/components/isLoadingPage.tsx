import React, {useMemo} from "react";


type Props = {
    isLoading?: boolean};

const IsLoadingPage: React.FC<Props> = (props) => {
    const messages = [
        "processing...",
        "Hang on tight, we're working on it...",
        "It's not easy being this efficient...",
        "We're doing the heavy lifting so you don't have to...",
        "One moment please, we're almost there..."
          ];

    const message = useMemo(() => {
        return messages[Math.floor(Math.random() * messages.length)]
    }, []);

  

  return  <>
        <p>{message}</p>
    </>
};

export default IsLoadingPage;