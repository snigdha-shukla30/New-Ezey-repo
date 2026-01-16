import React, { useRef, useState, useEffect } from "react";

// Table used below QuickAddBatch to show manually added batches
export default function BatchTable({ data = [] }) {
  const scrollRef = useRef(null);
  const [thumbTop, setThumbTop] = useState(0); // start at very top of track
  const [hasOverflow, setHasOverflow] = useState(false); // only show custom scrollbar when needed
  const trackHeight = 260; // keep in sync with .scroll-track-layout height in CSS
  const thumbHeight = 36.6854;

  // Update thumb position when user scrolls with wheel/trackpad
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    setHasOverflow(maxScroll > 0);
    if (maxScroll <= 0) {
      setThumbTop(0);
      return;
    }
    const maxOffset = trackHeight - thumbHeight;
    const ratio = scrollTop / maxScroll;
    setThumbTop(ratio * maxOffset);
  };

  // Drag handling state
  useEffect(() => {
    let startY = 0;
    let startScrollTop = 0;
    let dragging = false;

    const onMouseMove = (e) => {
      if (!dragging || !scrollRef.current) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;
      const maxOffset = trackHeight - thumbHeight;
      const deltaY = e.clientY - startY;
      const scrollDelta = (deltaY / maxOffset) * maxScroll;
      const next = Math.min(Math.max(startScrollTop + scrollDelta, 0), maxScroll);
      el.scrollTop = next;
    };

    const onMouseUp = () => {
      dragging = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    const el = scrollRef.current;
    if (!el) return;

    const thumb = el.parentElement?.querySelector(".scroll-thumb-layout");
    if (!thumb) return;

    const onMouseDown = (e) => {
      dragging = true;
      startY = e.clientY;
      startScrollTop = scrollRef.current ? scrollRef.current.scrollTop : 0;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      e.preventDefault();
    };

    thumb.addEventListener("mousedown", onMouseDown);

    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // On mount and whenever data changes, recalc if overflow exists
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight } = el;
    setHasOverflow(scrollHeight > clientHeight);
  }, [data]);

  return (
    <div
      className="bg-white w-full relative"
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "12.23px",
        border: "1.83px solid #DFDFDF",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* Header row with blue underline (simple, full-width) */}
      <div className="px-8 pt-3 pb-1 bg-white">
        <div
          className="flex items-center text-[14px] font-medium"
          style={{
            color: "#265768",
            fontFamily: "'Mulish', sans-serif",
          }}
        >
          <div className="flex-1 text-center">Degree / Course</div>
          <div className="flex-1 text-center">Batch code</div>
          <div className="flex-1 text-center">Department</div>
          <div className="flex-1 text-center">Capacity</div>
          <div className="flex-1 text-center">Semester</div>
          <div className="flex-1 text-center">Section</div>
          <div className="flex-1 text-center">Assigned Subjects</div>
          <div className="flex-1 text-center">Actions</div>
        </div>
        <div
          className="mt-2 h-[3px] rounded"
          style={{
            background: "#0b84d6",
            boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      {/* Data rows */}
      <div
        ref={scrollRef}
        className="overflow-y-auto no-scrollbar"
        style={{ maxHeight: "270px" }}
        onScroll={handleScroll}
      >
        <div className="px-8">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center py-3.5 hover:bg-gray-50 transition"
              style={{ borderBottom: "3px solid #D9D9D9" }}
            >
            <div className="flex-1 text-[13px] font-medium text-[#265768] text-center">{item.degree}</div>
            <div className="flex-1 text-[13px] text-[#265768] text-center">{item.batchCode}</div>
            <div className="flex-1 text-[13px] text-[#265768] truncate text-center">{item.department}</div>
            <div className="flex-1 text-[13px] text-[#265768] text-center">{item.capacity}</div>
            <div className="flex-1 text-[13px] text-[#265768] text-center">{item.semester}</div>
            <div className="flex-1 text-[13px] text-[#265768] text-center">{item.section}</div>
            <div className="flex-1 text-[13px] text-[#4BACCE] cursor-pointer hover:underline text-center">
              {item.subjects || "See List"}
            </div>
            <div className="flex-1 flex items-center justify-center gap-3">
              <button className="text-gray-400 hover:text-blue-600 transition">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.000244141 4.75149C0.000244141 3.49132 0.500846 2.28276 1.39192 1.39168C2.283 0.500602 3.49156 0 4.75174 0H9.78302C10.0425 0 10.2913 0.103068 10.4748 0.286531C10.6582 0.469993 10.7613 0.718822 10.7613 0.978277C10.7613 1.23773 10.6582 1.48656 10.4748 1.67002C10.2913 1.85349 10.0425 1.95655 9.78302 1.95655H4.75174C4.01047 1.95655 3.29957 2.25102 2.77542 2.77517C2.25126 3.29932 1.9568 4.01023 1.9568 4.75149V14.814C1.9568 15.5553 2.25126 16.2662 2.77542 16.7904C3.29957 17.3145 4.01047 17.609 4.75174 17.609H14.8143C15.5556 17.609 16.2665 17.3145 16.7906 16.7904C17.3148 16.2662 17.6092 15.5553 17.6092 14.814V9.78277C17.6092 9.52332 17.7123 9.27449 17.8958 9.09102C18.0792 8.90756 18.3281 8.80449 18.5875 8.80449C18.847 8.80449 19.0958 8.90756 19.2793 9.09102C19.4627 9.27449 19.5658 9.52332 19.5658 9.78277V14.814C19.5658 16.0742 19.0652 17.2828 18.1741 18.1739C17.283 19.0649 16.0745 19.5655 14.8143 19.5655H4.75174C3.49156 19.5655 2.283 19.0649 1.39192 18.1739C0.500846 17.2828 0.000244141 16.0742 0.000244141 14.814V4.75149Z"
                    fill="#265768"
                    fillOpacity="0.5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.852 10.9768L10.6949 12.2779L9.68433 10.6021L11.8414 9.30102L11.8444 9.29906C11.927 9.24927 12.0033 9.18947 12.0713 9.12101L16.9725 4.19441C17.0216 4.14491 17.0689 4.09369 17.1143 4.04082C17.4382 3.66321 17.9175 2.9158 17.3374 2.33275C16.8473 1.8397 16.1449 2.30536 15.69 2.70547C15.568 2.81305 15.4505 2.92564 15.3378 3.04298L15.3045 3.07624L10.4718 7.93338C10.3571 8.04745 10.2672 8.18401 10.2077 8.33448L9.4016 10.3624C9.38632 10.4006 9.38344 10.4426 9.39337 10.4825C9.40331 10.5224 9.42556 10.5581 9.45696 10.5847C9.48836 10.6112 9.52732 10.6272 9.56831 10.6303C9.6093 10.6334 9.64926 10.6236 9.68433 10.6021L10.6949 12.2779C8.9291 13.3423 6.82091 11.554 7.58396 9.63852L8.39104 7.61153C8.54818 7.21543 8.78453 6.85557 9.08562 6.55401L13.9173 1.69589L13.9457 1.66752C14.0895 1.52078 14.5728 1.02577 15.1588 0.669678C15.4787 0.476957 15.9893 0.221627 16.6203 0.172713C17.3442 0.114994 18.1171 0.342933 18.7236 0.9524C19.1878 1.41101 19.4798 2.01564 19.5503 2.66438C19.5987 3.17005 19.5214 3.67986 19.3252 4.14843C19.0415 4.84986 18.5681 5.36541 18.3597 5.57378L13.4585 10.5004C13.2759 10.6836 13.0737 10.8425 12.852 10.9768ZM17.2083 4.0056C17.2083 4.0056 17.2043 4.00854 17.1955 4.01147L17.2083 4.0056Z"
                    fill="#265768"
                    fillOpacity="0.5"
                  />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-red-600 transition">
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.19897 19.2843C2.65113 19.2843 2.18482 19.0919 1.80003 18.7071C1.41524 18.3223 1.22285 17.8564 1.22285 17.3094V2.16444H0V0.941592H4.89139V0H12.2285V0.941592H17.1199V2.16444H15.897V17.3094C15.897 17.8719 15.7087 18.3419 15.332 18.7193C14.9554 19.0968 14.485 19.2851 13.9209 19.2843H3.19897ZM14.6742 2.16444H2.44569V17.3094C2.44569 17.5287 2.51621 17.7089 2.65724 17.8499C2.79828 17.9909 2.97885 18.0614 3.19897 18.0614H13.9221C14.1096 18.0614 14.282 17.9832 14.4394 17.8267C14.5967 17.6701 14.675 17.4973 14.6742 17.3082V2.16444ZM5.87945 15.6158H7.10229V4.61013H5.87945V15.6158ZM10.0176 15.6158H11.2404V4.61013H10.0176V15.6158Z"
                    fill="#265768"
                    fillOpacity="0.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          ))}

          {data.length === 0 && (
            <div className="py-6 text-sm text-gray-500">No batches added.</div>
          )}
        </div>
      </div>

      {/* Static scrollbar layout on the right side - only when overflow exists */}
      {hasOverflow && (
        <div className="scroll-track-layout">
          <div
            className="scroll-thumb-layout"
            style={{ top: `${thumbTop}px`, left: "50%", transform: "translateX(-50%)" }}
          />
        </div>
      )}
    </div>
  );
}
