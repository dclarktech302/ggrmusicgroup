import { redirect } from "next/navigation";

// Temporary (307) while #20 replaces this with the next-event page; old links and Instagram land on the gallery.
export default function Shows() {
    redirect("/gallery");
}
