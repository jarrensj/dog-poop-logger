-- Add dog_id column to link poops to dogs table
ALTER TABLE poops ADD COLUMN dog_id UUID;

-- Add foreign key constraint with CASCADE delete
ALTER TABLE poops ADD CONSTRAINT fk_poops_dog_id 
    FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;
