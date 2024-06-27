import clsx from "clsx";

export function TextInput(params: any) {
  return (
    < div className="mb-4" >
      {params.label &&
        <label htmlFor={params.fieldName} className="mb-2 block text-sm font-medium">
          {params.label}
        </label>
      }
      <div className="relative">
        <input
          id={params.fieldName}
          name={params.fieldName}
          type={params.type ?? 'text'}
          pattern={params.pattern ?? ''}
          disabled={params.disabled && params.disabled === true}
          readOnly={params.readOnly && params.readOnly === true}
          className={clsx("peer w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500", params.hidden === false && "block", params.hidden === true && "hidden")}
          defaultValue={params.defaultValue}
          placeholder={params.placeholder}
          aria-describedby={!params.hidden ? (params.fieldName + "-error") : ''}
          required={params.required}
          hidden={params.hidden}
        >
        </input>
        {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
      </div>
      {!params.hidden && <div id={params.fieldName + "-error"} aria-live="polite" aria-atomic="true">
        {params.state.errors?.address &&
          params.state.errors.address.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>}

    </div >

  );

}

const toDateString = (d: Date | string) => {
  if (d) {
    if (typeof d === 'object' && d instanceof Date) {
      const f: Date = d as unknown as Date;
      return f.toISOString().substring(0, 10);
    } else if (typeof d === 'string') {
      return d.substring(0, 10);
    }
  }
  return "";

}

export function DateInput(params: any) {
  const defaultValue = toDateString(params.defaultValue)
  if (params.defaultValue)
    return (
      < div className="mb-4" >
        {params.label &&
          <label htmlFor={params.fieldName} className="mb-2 block text-sm font-medium">
            {params.label}
          </label>
        }
        <div className="relative">
          <input
            id={params.fieldName}
            name={params.fieldName}
            type="date"
            className={clsx("peer w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500", params.hidden === false && "block", params.hidden === true && "hidden")}
            defaultValue={defaultValue}
            placeholder={params.fieldName}
            aria-describedby={params.fieldName + "-error"}
            disabled={params.disabled && params.disabled === true}
            readOnly={params.readOnly && params.readOnly === true}
            required={params.required}
            hidden={params.hidden}
          >
          </input>
          {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
        </div>
        <div id={params.fieldName + "-error"} aria-live="polite" aria-atomic="true">
          {params.state.errors?.address &&
            params.state.errors.address.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

      </div >
    );

}