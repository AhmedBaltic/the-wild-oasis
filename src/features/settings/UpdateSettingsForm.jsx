import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner.jsx';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting.js';

function UpdateSettingsForm() {

  const { isLoading, settings: { minBookingLength, maxBookingLength, maxGuestsPerCabin, brekfastPrice } = {} } = useSettings()
  const { isUpdating, updateSetting } = useUpdateSetting()

  if (isLoading) return <Spinner></Spinner>

  function handleUpdate(e, field) {
    const value = e.target.value
    if (!value) return
    updateSetting({ [field]: value })
  }

  return (
    <Form>
      <FormRow label='Minimum nights/booking'>
        <Input type='number' id='min-nights' defaultValue={minBookingLength}
          disabled={isUpdating} onBlur={e => handleUpdate(e, "minBookingLength")} />
      </FormRow>

      <FormRow label='Maximum nights/booking'>
        <Input type='number' id='max-nights' defaultValue={maxBookingLength} disabled={isUpdating} onBlur={e => handleUpdate(e, "max-nights")} />
      </FormRow>

      <FormRow label='Maximum guests/booking'>
        <Input type='number' id='max-guests' defaultValue={maxGuestsPerCabin} disabled={isUpdating} onBlur={e => handleUpdate(e, "max-guests")} />
      </FormRow>

      <FormRow label='Breakfast price'>
        <Input type='number' id='breakfast-price' defaultValue={brekfastPrice} disabled={isUpdating} onBlur={e => handleUpdate(e, "breakfast-price")} />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
