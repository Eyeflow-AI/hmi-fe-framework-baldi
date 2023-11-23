import AutoComplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

import { useTranslation } from "react-i18next";



export default function TextFieldWithChips({ label, value, onChange, options, ...props }) {
  
    const { t } = useTranslation();
  
    const [inputValue, setInputValue] = useState('');
  
    const [chips, setChips] = useState([]);
  
    const [optionsList, setOptionsList] = useState(options);
  
    const handleAddChip = (chip) => {
      if (chip && !chips.includes(chip)) {
        setChips([...chips, chip]);
        onChange([...chips, chip]);
      }
    };
  
    const handleDeleteChip = (chip) => {
      setChips(chips.filter((c) => c !== chip));
      onChange(chips.filter((c) => c !== chip));
    };
  
    const handleInputChange = (event, newInputValue) => {
      setInputValue(newInputValue);
    };
  
    const handleInputKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleAddChip(inputValue);
        setInputValue('');
      }
    };
  
    const handleBlur = () => {
      handleAddChip(inputValue);
      setInputValue('');
    };
  
    useEffect(() => {
      setOptionsList(options.filter((o) => !chips.includes(o)));
    }, [chips, options]);
  
    return (
      <AutoComplete
        clearIcon={false}
        options={[]}
        freeSolo
        multiple
        renderTags={(value, props) =>
          value.map((option, index) => (
            <Chip label={option} {...props({ index })} />
          ))
        }
        renderInput={(params) => <TextField label="Add Tags" {...params} />}
      />
    );
  }