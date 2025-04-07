import { Button } from "@/components/ui/button";
import { useAuthKit } from "@picahq/authkit";

export function AuthKitButton() {
    const { open } = useAuthKit({
        token: {
            url: "https://api.your-company-name.com/authkit-token",
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