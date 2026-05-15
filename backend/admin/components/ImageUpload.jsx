import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  DropZone,
  FormGroup,
  FormMessage,
  Input,
  Label,
  Text,
} from '@adminjs/design-system'

const getValue = (record, property) => record?.params?.[property.path] || ''

const ImageUpload = (props) => {
  const { property, record, onChange } = props
  const [value, setValue] = useState(getValue(record, property))
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const error = record?.errors?.[property.path]

  useEffect(() => {
    setValue(getValue(record, property))
  }, [record.params?.[property.path]])

  const commitValue = (nextValue) => {
    setValue(nextValue)
    if (typeof onChange === 'function') {
      onChange(property.path, nextValue)
    }
  }

  const uploadFile = async (files) => {
    const file = files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/admin/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed')
      }

      commitValue(data.url)
      setMessage('Image uploaded')
    } catch (uploadError) {
      setMessage(uploadError.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  if (typeof onChange !== 'function') {
    return value ? (
      <img
        src={value}
        alt=""
        style={{
          width: '86px',
          height: '58px',
          objectFit: 'cover',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          display: 'block',
        }}
      />
    ) : (
      <Text color="grey60">No image</Text>
    )
  }

  return (
    <FormGroup error={Boolean(error)}>
      <Label>{property.label}</Label>

      {value ? (
        <Box mb="lg">
          <img
            src={value}
            alt=""
            style={{
              width: '160px',
              height: '110px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              display: 'block',
              marginBottom: '10px',
            }}
          />
          <Button type="button" size="sm" variant="light" onClick={() => commitValue('')}>
            Remove image
          </Button>
        </Box>
      ) : null}

      <DropZone
        multiple={false}
        onChange={uploadFile}
        validate={{
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maxSize: 5 * 1024 * 1024,
        }}
      />

      <Text color="grey60" mt="default">
        Or paste an existing image URL.
      </Text>
      <Input
        mt="sm"
        value={value}
        disabled={property.isDisabled || isUploading}
        placeholder="/uploads/admin/example.webp"
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => onChange(property.path, value)}
      />

      <FormMessage>
        {error?.message || message || (isUploading ? 'Uploading...' : '')}
      </FormMessage>
    </FormGroup>
  )
}

export default ImageUpload
