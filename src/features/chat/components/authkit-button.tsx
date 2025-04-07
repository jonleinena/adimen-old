import { Button } from "@/components/ui/button";
import { getURL } from "@/utils/get-url";
import { useAuthKit } from "@picahq/authkit";

export function AuthKitButton() {
    const { open } = useAuthKit({
        token: {
            url: getURL("api/authkit"),
            headers: {},
        },
        onSuccess: (connection) => { },
        onError: (error) => { },
        onClose: () => { },
    });

    return (
        <Button onClick={open}>
            Connect Tools
        </Button>
    );
}