import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider, useI18n } from "./I18nProvider";

const STORAGE_KEY = "plus-studio-locale";

function Probe() {
    const { locale, setLocale } = useI18n();
    return (
        <div>
            <span data-testid="locale">{locale}</span>
            <button onClick={() => setLocale("en")}>english</button>
        </div>
    );
}

function goTo(search: string) {
    window.history.replaceState({}, "", search === "" ? "/" : `/?${search}`);
}

describe("I18nProvider", () => {
    beforeEach(() => {
        window.localStorage.clear();
        goTo("");
    });

    it("takes the locale from ?lang= - how the marketing site hands off", () => {
        goTo("lang=id");
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>,
        );

        expect(screen.getByTestId("locale")).toHaveTextContent("id");
    });

    it("falls back to the browser language when no choice was made", () => {
        expect(window.navigator.language.startsWith("en")).toBe(true);
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>,
        );

        expect(screen.getByTestId("locale")).toHaveTextContent("en");
    });

    it("ignores an unknown ?lang= value", () => {
        goTo("lang=fr");
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>,
        );

        expect(screen.getByTestId("locale")).toHaveTextContent("en");
    });

    it("persists a change and mirrors it onto <html lang>", () => {
        goTo("lang=id");
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>,
        );

        fireEvent.click(screen.getByRole("button", { name: "english" }));

        expect(screen.getByTestId("locale")).toHaveTextContent("en");
        expect(window.localStorage.getItem(STORAGE_KEY)).toBe("en");
        expect(document.documentElement.lang).toBe("en");
    });

    it("refuses to be used outside the provider", () => {
        vi.spyOn(console, "error").mockImplementation(() => {});

        expect(() => render(<Probe />)).toThrow(/within an I18nProvider/);
    });
});
