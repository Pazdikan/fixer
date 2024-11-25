import { useEffect } from 'react';
import Mousetrap from 'mousetrap';

interface KeybindType {
    key: string,
    execute: () => void;
}

const useGlobalKeybindings = () => {
    // TODO: remake registering keybinds into api 

    const keybinds: KeybindType[] = [
        {
            key: "2+1+3+7",
            execute: () => {
                // TODO: remake custom commands/functions into api
                // this will be used for console commands as well as keybinds
                console.log("debug toggle")
            }
        }
    ]

    useEffect(() => {
        keybinds.forEach((kb) => {
            Mousetrap.bind(kb.key, kb.execute)
        })

        return () => {
            keybinds.forEach((kb) => {
                Mousetrap.unbind(kb.key)
            })
        };
    }, []);
};

export default useGlobalKeybindings;
