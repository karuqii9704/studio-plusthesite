import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

function Bomb({ armed }: { armed: boolean }) {
    if (armed) throw new Error("kabel putus");
    return <p>workspace aman</p>;
}

describe("ErrorBoundary", () => {
    beforeEach(() => {
        // React logs the caught error itself; the assertion is not about noise.
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("renders its children while nothing throws", () => {
        render(
            <ErrorBoundary>
                <Bomb armed={false} />
            </ErrorBoundary>,
        );

        expect(screen.getByText("workspace aman")).toBeInTheDocument();
    });

    it("catches a render error and shows the default fallback", () => {
        render(
            <ErrorBoundary>
                <Bomb armed />
            </ErrorBoundary>,
        );

        expect(screen.getByText(/Terjadi kesalahan/)).toBeInTheDocument();
        expect(screen.getByText(/kabel putus/)).toBeInTheDocument();
    });

    it("reports the error upward", () => {
        const onError = vi.fn();

        render(
            <ErrorBoundary onError={onError}>
                <Bomb armed />
            </ErrorBoundary>,
        );

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(onError.mock.calls[0][0].message).toBe("kabel putus");
    });

    it("recovers when the custom fallback resets it", () => {
        function Harness() {
            const [armed, setArmed] = useState(true);
            return (
                <ErrorBoundary
                    fallback={({ error, reset }) => (
                        <div>
                            <p>gagal: {error.message}</p>
                            <button
                                onClick={() => {
                                    setArmed(false);
                                    reset();
                                }}
                            >
                                pulihkan
                            </button>
                        </div>
                    )}
                >
                    <Bomb armed={armed} />
                </ErrorBoundary>
            );
        }

        render(<Harness />);
        expect(screen.getByText("gagal: kabel putus")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "pulihkan" }));

        expect(screen.getByText("workspace aman")).toBeInTheDocument();
    });
});
