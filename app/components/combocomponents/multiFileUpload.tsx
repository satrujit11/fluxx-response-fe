import { useController } from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { UploadIcon, XIcon } from "lucide-react"
import { FormLabel } from "../ui/form"

type FileUploadProps = {
  control: any
  name: string
  label: string
  multi?: boolean // Determines if multiple file selection is allowed
}

export const FileUpload = ({ control, name, label, multi = false }: FileUploadProps) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: multi ? [] : null, // Set default value based on `multi`
  })

  // Handle file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      field.onChange(multi ? Array.from(files) : files[0]) // Handle single vs multiple files
    }
  }

  // Handle file removal
  const removeFile = (index?: number) => {
    if (multi) {
      const updatedFiles = field.value.filter((_: any, i: number) => i !== index)
      field.onChange(updatedFiles)
    } else {
      field.onChange(null) // Clear the single file
    }
  }

  return (
    <div>
      <div className="space-y-2">
        <FormLabel>{label}</FormLabel>
        <Input
          type="file"
          multiple={multi} // Enable multiple selection if `multi` is true
          accept="*/*" // Accept any file type
          onChange={onFileChange}
          className="mb-4"
        />
        <p className="text-sm text-gray-500">
          {multi ? "You can upload multiple files." : "Upload a single file."}
        </p>
      </div>

      {/* Display Selected Files */}
      <div className="grid gap-2">
        {multi ? (
          field.value?.map((file: File, index: number) => (
            <FileItem key={index} file={file} onRemove={() => removeFile(index)} />
          ))
        ) : (
          field.value && <FileItem file={field.value} onRemove={() => removeFile()} />
        )}
      </div>

      {/* Show error message if any */}
      {fieldState?.error?.message && (
        <p className="text-red-500 text-sm mt-2">{fieldState.error.message}</p>
      )}
    </div>
  )
}

// Reusable file item component
const FileItem = ({ file, onRemove }: { file: File; onRemove: () => void }) => (
  <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
    <div className="flex items-center gap-3">
      <UploadIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-50">{file.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{`${(
          file.size / 1024 / 1024
        ).toFixed(2)} MB`}</div>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      onClick={onRemove} // Remove file on button click
    >
      <XIcon className="h-5 w-5" />
      <span className="sr-only">Remove {file.name}</span>
    </Button>
  </div>
)

